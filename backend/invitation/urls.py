from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import InvitationViewSet

router = DefaultRouter()
router.register(r'invitations', InvitationViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]