from invitation.models import InvitationStatus
from rest_framework import permissions


class IsEventCreatorOrEventMember(permissions.BasePermission):
    """
    Custom permission to allow users to view events if they are either the creator
    or have accepted an invitation.
    """
    def has_object_permission(self, request, view, obj):
        # Allow access if the user is the creator or has accepted the invitation
        return obj.created_by == request.user or obj.invitations.filter(invitee=request.user, status=InvitationStatus.ACCEPTED).exists()

class IsEventCreator(permissions.BasePermission):
    """
    Custom permission to only allow the creator of the event to modify (PATCH/PUT/DELETE) it.
    """
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user