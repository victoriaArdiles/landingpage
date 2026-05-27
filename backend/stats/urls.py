from django.urls import path
from .views import get_stats

urlpatterns = [
    path('stats/', get_stats, name='program-stats'),
]
