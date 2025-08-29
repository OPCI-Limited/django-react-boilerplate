from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db.models import Q, Count, Max
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken


class UserQuerySet(models.QuerySet):
    def with_active_tokens(self):
        now = timezone.now()
        return self.annotate(
            active_tokens=Count(
                'outstandingtoken',
                filter=(Q(outstandingtoken__expires_at__gt=now) & Q(outstandingtoken__blacklistedtoken__isnull=True)),
                distinct=True,
            )
        )

    def with_last_token_issued(self):
        return self.annotate(last_token_issued=Max('outstandingtoken__created_at'))

    def with_login_counts(self):
        now = timezone.now()
        return self.annotate(
            logins_7d=Count(
                'login_events',
                filter=Q(login_events__created_at__gte=now - timezone.timedelta(days=7)),
                distinct=True,
            ),
            logins_30d=Count(
                'login_events',
                filter=Q(login_events__created_at__gte=now - timezone.timedelta(days=30)),
                distinct=True,
            ),
        )

    def with_session_ends(self):
        now = timezone.now()
        # Annotate last blacklist time and last expiry time for tokens
        return self.annotate(
            last_blacklisted=Max('outstandingtoken__blacklistedtoken__blacklisted_at'),
            last_expired=Max('outstandingtoken__expires_at', filter=Q(outstandingtoken__expires_at__lte=now)),
        )

    def with_session_metrics(self):
        """Convenience method to annotate all common session/login metrics."""
        return (
            self.with_active_tokens()
                .with_last_token_issued()
                .with_login_counts()
                .with_session_ends()
        )


class CustomUserManager(BaseUserManager.from_queryset(UserQuerySet)):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class LowerCaseEmailField(models.EmailField):
    """ Robust way to ensure emails are always stored as lowercase """
    def get_prep_value(self, value):
        value = super(LowerCaseEmailField, self).get_prep_value(value)
        if value is not None:
            value = value.lower()
        return value


class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    username = None
    email = LowerCaseEmailField('Email address', max_length=255, unique=True)

    objects = CustomUserManager()


class LoginEvent(models.Model):
    """Record of successful JWT logins for analytics/visibility."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='login_events')
    created_at = models.DateTimeField(auto_now_add=True)
    ip = models.CharField(max_length=45, blank=True, default='')  # supports IPv6
    user_agent = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"LoginEvent(user={self.user_id}, at={self.created_at:%Y-%m-%d %H:%M:%S})"
