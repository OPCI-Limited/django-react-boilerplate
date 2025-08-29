from typing import Any, Optional

from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .models import LoginEvent

from .models import User
from .serializers import (
    RegistrationSerializer,
    UserSerializer,
)


class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        # Operate on the authenticated user instead of a queryset lookup
        return self.request.user

    def retrieve(self, request: Request, *args: dict[str, Any], **kwargs: dict[str, Any]) -> Response:
        """Return user on GET request."""
        serializer = self.serializer_class(request.user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request: Request, *args: dict[str, Any], **kwargs: dict[str, Any]) -> Response:
        """Return updated user."""
        serializer = self.serializer_class(self.get_object(), data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request: Request) -> Response:
        """Blacklist the provided refresh token to log the user out."""
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'Missing refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_205_RESET_CONTENT)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # At this point authentication succeeded and serializer.user is set,
        # but refresh token not yet created; we can inspect pre-existing sessions.
        user = serializer.user
        now = timezone.now()

        pre_existing_active = OutstandingToken.objects.filter(
            user=user,
            expires_at__gt=now,
        ).exclude(id__in=BlacklistedToken.objects.values('token')).exists()

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        # Only set last_login if there was no active session already, or if it's not set yet
        if not pre_existing_active or not user.last_login:
            user.last_login = now
            user.save(update_fields=['last_login'])

        # Record login event for analytics
        xff = request.META.get('HTTP_X_FORWARDED_FOR')
        ip = (xff.split(',')[0].strip() if xff else request.META.get('REMOTE_ADDR', '')) or ''
        ua = request.META.get('HTTP_USER_AGENT', '')
        try:
            LoginEvent.objects.create(user=user, ip=ip, user_agent=ua)
        except Exception:
            # Never block login if analytics write fails
            pass

        return response
