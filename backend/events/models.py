from django.db import models
from django.conf import settings  # Import settings instead of User directly

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=255)
    organizer = models.EmailField()

    def __str__(self):
        return self.title

class Invitation(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="invitations")
    invitee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="invitations")
    status = models.CharField(
        max_length=10, choices=[("Pending", "Pending"), ("Accepted", "Accepted"), ("Declined", "Declined")], default="Pending"
    )

    def __str__(self):
        return f"{self.invitee} invited to {self.event.title}"
