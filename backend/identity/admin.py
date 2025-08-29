from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from django.contrib.auth.forms import UserChangeForm

from .models import User
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
    list_display = ('email', 'first_name', 'last_name', 'is_active')

    # You can specify search fields, filtering, etc.
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined', )

    actions = [
        'logout_all_sessions',
    ]

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
