from rest_framework import serializers
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from .models import Event, Invitee
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
