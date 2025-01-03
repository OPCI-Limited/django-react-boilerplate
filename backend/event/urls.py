from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, InviteeEventViewSet, InviteeViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'invitees', InviteeViewSet)
router.register(r'invitee_event_view', InviteeEventViewSet, basename='invitee_event_view')

urlpatterns = [
    path('', include(router.urls)),
]
