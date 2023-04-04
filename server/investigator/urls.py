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

router.register(r"user/holdings", user_views.HoldingViewSet, "holding"),

router.register(r"user/watchlists", user_views.WatchlistViewSet, "watchlist")
router.register(r"user/portfolios", user_views.PortfolioViewSet, "portfolio")
router.register(r"user/accounts", user_views.AccountViewSet)
router.register(r"user/users", user_views.UserViewSet, "user")
router.register(r"user/transactions", user_views.TransactionViewSet, "transaction")

router.register(r"strategy/list", strategy_views.StrategyViewSet, "strategy")
router.register(r"strategy/targets", strategy_views.TargetViewSet, "target")
router.register(r"strategy/changes", strategy_views.TargetChangeViewSet, "target_change")

router.register(r"tags", oracle_views.TagViewSet, "tag")
router.register(r"categories", oracle_views.CategoryViewSet, "category")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("dj_rest_auth.urls")),
    path("", include(router.urls)),
]
