# Add Factories
import factory

import faker

from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory

User = get_user_model()
FAKE = faker.Faker()


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("email",)
        exclude = ('plaintext_password',)

    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")

    email = factory.LazyAttribute(lambda o: "{o.first_name}.{o.last_name}@{domain}".format(
        o=o, domain=FAKE.free_email_domain()).lower())
    plaintext_password = factory.PostGenerationMethodCall('set_password', 'defaultpassword')
