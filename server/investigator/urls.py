from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from investigator.oracle import views as oracle_views
from investigator.user import views as user_views
from investigator.strategy import views as strategy_views

router = routers.DefaultRouter()
router.register(r"oracle/assets", oracle_views.AssetViewSet, "asset")
router.register(r"oracle/services", oracle_views.ServiceViewSet)
router.register(
    r"oracle/watchlists", oracle_views.PublicWatchlistsViewSet, "public-watchlists"
)
router.register(r"oracle/categories", oracle_views.CategoryViewSet, "category")
router.register(r"oracle/tags", oracle_views.TagViewSet, "tag")
router.register(r"oracle/taxonomy", oracle_views.TaxonomyViewSet, "taxonomy")

router.register(r"user/holdings", user_views.HoldingViewSet),

router.register(r"user/watchlist", user_views.WatchlistViewSet, "watchlist")
router.register(r"user/portfolios", user_views.PortfolioViewSet, "portfolio")
router.register(r"user/accounts", user_views.AccountViewSet)
router.register(r"user/users", user_views.UserViewSet, "user")

router.register(r"strategy/list", strategy_views.StrategyViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("rest_auth.urls")),
    path("", include(router.urls)),
]
