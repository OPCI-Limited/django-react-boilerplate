from django.db import models
from django.conf import settings  # For settings.AUTH_USER_MODEL

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Use the custom user model
        on_delete=models.CASCADE,
        related_name='events'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Invitee(models.Model):
    RSVP_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]
    id = models.AutoField(primary_key=True)
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='invitees'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Use the custom user model
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='invitees'
    )
    email = models.EmailField()
    rsvp_status = models.CharField(
        max_length=10,
        choices=RSVP_CHOICES,
        default='pending'
    )

    def __str__(self):
        return f'{self.email} - {self.rsvp_status}'


class InviteeEventView(models.Model):
    id = models.CharField(max_length=255, primary_key=True)  # Use the id from the view
    invitee_id = models.IntegerField()
    event_id = models.IntegerField()
    user_id = models.IntegerField()
    email = models.EmailField()
    rsvp_status = models.CharField(max_length=10)
    event_title = models.CharField(max_length=255)
    event_description = models.TextField()
    event_location = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    event_created_by = models.IntegerField()
    event_created_at = models.DateTimeField()
    event_updated_at = models.DateTimeField()
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    host_email = models.EmailField()

    class Meta:
        managed = False  # Do not create or manage the view in migrations
        db_table = 'invitee_event_view'
        ordering = ['event_created_at']
