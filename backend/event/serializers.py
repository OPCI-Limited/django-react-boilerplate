from rest_framework import serializers
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from .models import Event, Invitee, Notification
from .models import InviteeEventView

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    def validate(self, data):
        if data['end_date'] <= data['start_date']:
            raise ValidationError("End date must be after start date.")
        if data['start_date'] < timezone.now():
            raise ValidationError("Start date must be in the future.")
        return data

class InviteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitee
        fields = '__all__'



class InviteeEventViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = InviteeEventView
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source="event.title", read_only=True)
    start_date = serializers.DateTimeField(source="event.start_date", read_only=True)
    event_location = serializers.DateTimeField(source="event.location", read_only=True)
    
    

    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at', 'event', 'event_title', 'start_date', 'event_location']