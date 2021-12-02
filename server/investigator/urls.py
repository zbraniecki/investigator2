from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from investigator.oracle import views as oracle_views
from investigator.profile import views as profile_views
from investigator.strategy import views as strategy_views

router = routers.DefaultRouter()
router.register(r"oracle/assets", oracle_views.AssetViewSet, "Asset")
router.register(r"oracle/wallets", oracle_views.ServiceViewSet)
router.register(
    r"oracle/watchlists", oracle_views.PublicWatchlistsViewSet, "public-watchlists"
)
router.register(r"profile/watchlist", profile_views.WatchlistViewSet, "Watchlist")
router.register(r"profile/portfolio", profile_views.PortfolioViewSet, "Portfolio")
router.register(r"profile/account", profile_views.AccountViewSet)
router.register(r"profile/holding", profile_views.HoldingViewSet)
router.register(r"profile/users", profile_views.UserViewSet, "User")
router.register(r"strategy/list", strategy_views.StrategyViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("rest_auth.urls")),
    path("", include(router.urls)),
]
