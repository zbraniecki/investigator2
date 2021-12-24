from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from investigator.oracle import views as oracle_views
from investigator.user import views as user_views
from investigator.strategy import views as strategy_views

router = routers.DefaultRouter()
router.register(r"oracle/assets", oracle_views.AssetViewSet, "Asset")
router.register(r"oracle/wallets", oracle_views.ServiceViewSet)
router.register(
    r"oracle/watchlists", oracle_views.PublicWatchlistsViewSet, "public-watchlists"
)

router.register(r"user/holdings", user_views.HoldingViewSet),

router.register(r"user/watchlist", user_views.WatchlistViewSet, "Watchlist")
router.register(r"user/portfolio", user_views.PortfolioViewSet, "Portfolio")
router.register(r"user/account", user_views.AccountViewSet)
router.register(r"user/users", user_views.UserViewSet, "User")

router.register(r"strategy/list", strategy_views.StrategyViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("rest_auth.urls")),
    path("", include(router.urls)),
]
