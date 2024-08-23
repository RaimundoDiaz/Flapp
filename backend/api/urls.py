from django.urls import path
from .views.api import *

urlpatterns = [
    path("api/cart", CartCreateView.as_view()),
]
