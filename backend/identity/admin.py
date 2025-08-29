from django.contrib import admin, messages
from django.utils import timezone
from django.db.models import Max
from django.db.models.functions import Coalesce
from django.db.models import F
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from django.contrib.auth.forms import UserChangeForm

from .models import User, LoginEvent
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']  # Add any other fields you want

    # Exclude the password field or make it optional
    def clean_password(self):
        return ""  # Prevent form validation from requiring a password


class CustomUserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm  # Use the custom change form

    # Define the fields to be shown in the admin form
    fieldsets = (
        (None, {'fields': ('email', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )

    # Fields to display in the list view
    list_display = (
        'email', 'first_name', 'last_name', 'is_active',
        'last_login', 'active_tokens', 'last_token_issued', 'session_age',
        'logins_7d', 'logins_30d'
    )

    # You can specify search fields, filtering, etc.
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined', )

    actions = [
        'logout_all_sessions',
    ]

    class OutstandingTokenInline(admin.TabularInline):
        model = OutstandingToken
        extra = 0
        can_delete = False
        readonly_fields = ('jti', 'created_at', 'expires_at', 'is_blacklisted')
        fields = ('jti', 'created_at', 'expires_at', 'is_blacklisted')

        def is_blacklisted(self, obj):
            return BlacklistedToken.objects.filter(token=obj).exists()
        is_blacklisted.boolean = True

    inlines = [OutstandingTokenInline]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Use manager queryset helper to annotate common session/login metrics
        return qs.with_session_metrics()

    def _active_tokens_qs(self, user):
        now = timezone.now()
        tokens = OutstandingToken.objects.filter(user=user, expires_at__gt=now)
        tokens = tokens.exclude(id__in=BlacklistedToken.objects.values('token'))
        return tokens

    def active_tokens(self, obj):
        # Prefer annotated value to avoid N+1
        val = getattr(obj, 'active_tokens', None)
        if val is not None:
            return val
        return self._active_tokens_qs(obj).count()
    active_tokens.short_description = 'Active sessions'

    def last_token_issued(self, obj):
        # Use annotated value when present
        val = getattr(obj, 'last_token_issued', None)
        if val is not None:
            return val
        t = self._active_tokens_qs(obj).order_by('-created_at').first()
        return t.created_at if t else None
    last_token_issued.admin_order_field = 'outstandingtoken__created_at'

    def _format_delta(self, delta):
        days = delta.days
        secs = delta.seconds
        hrs = secs // 3600
        mins = (secs % 3600) // 60
        if days:
            return f"{days}d {hrs}h"
        if hrs:
            return f"{hrs}h {mins}m"
        return f"{mins}m"

    def session_age(self, obj):
        """Age of current or last session based on last_login and token events.

        - If user has active tokens: now - last_login.
        - Else: (last blacklist or expiry) - last_login.
        """
        if not obj.last_login:
            return '-'

        now = timezone.now()
        active = getattr(obj, 'active_tokens', None)
        has_active = (active is not None and active > 0) or self._active_tokens_qs(obj).exists()

        if has_active:
            delta = now - obj.last_login
            return self._format_delta(delta)

        # No active sessions: show duration for most recent ended session
        end = getattr(obj, 'last_blacklisted', None) or getattr(obj, 'last_expired', None)
        if end is None:
            # Fallback to queries if not annotated
            last_blacklisted = (
                BlacklistedToken.objects
                .filter(token__user=obj)
                .aggregate(max_dt=Max('blacklisted_at'))['max_dt']
            )
            last_expired = (
                OutstandingToken.objects
                .filter(user=obj, expires_at__lte=now)
                .aggregate(max_dt=Max('expires_at'))['max_dt']
            )
            end = last_blacklisted or last_expired
        if end and end > obj.last_login:
            return self._format_delta(end - obj.last_login)
        return '-'
    session_age.short_description = 'Session age'

    def logins_7d(self, obj):
        val = getattr(obj, 'logins_7d', None)
        if val is not None:
            return val
        since = timezone.now() - timezone.timedelta(days=7)
        return LoginEvent.objects.filter(user=obj, created_at__gte=since).count()
    logins_7d.short_description = 'Logins (7d)'

    def logins_30d(self, obj):
        val = getattr(obj, 'logins_30d', None)
        if val is not None:
            return val
        since = timezone.now() - timezone.timedelta(days=30)
        return LoginEvent.objects.filter(user=obj, created_at__gte=since).count()
    logins_30d.short_description = 'Logins (30d)'


@admin.register(LoginEvent)
class LoginEventAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'ip')
    list_filter = ('user',)
    search_fields = ('user__email', 'ip', 'user_agent')
    date_hierarchy = 'created_at'
    readonly_fields = ('user', 'created_at', 'ip', 'user_agent')

    def logout_all_sessions(self, request, queryset):
        total_blacklisted = 0
        for user in queryset:
            tokens = OutstandingToken.objects.filter(user=user)
            for token in tokens:
                _, created = BlacklistedToken.objects.get_or_create(token=token)
                if created:
                    total_blacklisted += 1

        self.message_user(
            request,
            f"Blacklisted {total_blacklisted} outstanding refresh token(s) for selected user(s).",
            level=messages.SUCCESS,
        )
    logout_all_sessions.short_description = "Logout all sessions (blacklist refresh tokens)"


admin.site.register(User, CustomUserAdmin)
