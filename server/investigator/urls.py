from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from investigator.oracle import views as oracle_views
from investigator.profile import views as profile_views
from investigator.strategy import views as strategy_views

router = routers.DefaultRouter()
router.register(r"categories", oracle_views.CategoryViewSet)
router.register(r"assets", oracle_views.AssetViewSet)
router.register(r'oracle/assets', oracle_views.AssetInfoViewSet, 'AssetInfo')
router.register(r"oracle/wallets", oracle_views.ServiceViewSet)
router.register(
    r"oracle/watchlists", oracle_views.PublicWatchlistsViewSet, "public-watchlists"
)
router.register(r"profile/watchlist", profile_views.WatchlistViewSet)
router.register(r"profile/portfolio", profile_views.PortfolioViewSet)
router.register(r"profile/account", profile_views.AccountViewSet)
router.register(r"profile/holding", profile_views.HoldingViewSet)
router.register(r"strategy/list", strategy_views.StrategyViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("rest_auth.urls")),
    path("", include(router.urls)),
]
