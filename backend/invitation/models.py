from django.contrib.auth import get_user_model
from django.db import models
from events.models import Event

User = get_user_model()


class InvitationStatus(models.TextChoices):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    DECLINED = 'declined'


class Invitation(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='invitations')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations')
    invitee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_invitations')
    status = models.CharField(
            max_length=10,
            choices=InvitationStatus.choices,
            default=InvitationStatus.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
            return f'Invitation to {self.event.title} for {self.user.username}'
