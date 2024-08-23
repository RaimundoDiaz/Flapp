from django.urls import path
from rest_framework import routers

from .views.api import *

router = routers.SimpleRouter()
router.register("cart", CartViewSet)
router.register("product", ProductViewSet)

urlpatterns = router.urls + [
    path("api/cart", CartApiCreateView.as_view()),
]
