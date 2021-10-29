from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from server.oracle import views as oracle_views
from server.account import views as account_views
from server.strategy import views as strategy_views

router = routers.DefaultRouter()
router.register(r"categories", oracle_views.CategoryViewSet)
router.register(r"assets", oracle_views.AssetViewSet)
router.register(r"oracle/assets", oracle_views.PriceViewSet)
router.register(r"oracle/wallets", oracle_views.ServiceViewSet)
router.register(
    r"oracle/watchlists", oracle_views.PublicWatchlistsViewSet, "public-watchlists"
)
router.register(r"account/watchlist", account_views.WatchlistViewSet)
router.register(r"account/portfolio", account_views.PortfolioViewSet)
router.register(r"account/holding", account_views.HoldingViewSet)
router.register(r"strategy/list", strategy_views.StrategyViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
