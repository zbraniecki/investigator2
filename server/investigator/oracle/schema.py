import graphene
import graphql_jwt
from django.db.models import Q
from graphene_django import DjangoObjectType, DjangoListField
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphene_django_crud.types import DjangoCRUDObjectType, resolver_hints
from investigator.user.models import User, Watchlist, WatchlistType as WatchlistTypeEnum, Portfolio, WatchlistUI
from investigator.oracle.models import Asset, AssetInfo, Tag
from investigator.oracle.dynamic_lists import get_dynamic_assets

class UserType(DjangoCRUDObjectType):
    class Meta:
        model = User

    @classmethod
    def get_queryset(cls, parent, info, **kwargs):
        print(info.context.user)
        return User.objects.filter(pk = info.context.user.pk)

class AssetType(DjangoCRUDObjectType):
    class Meta:
        model = Asset

class AssetType2(DjangoObjectType):
    class Meta:
        model = Asset

class WatchlistType(DjangoCRUDObjectType):
    assets = DjangoListField(AssetType2)

    class Meta:
        model = Watchlist
        convert_choices_to_enum = False

    @classmethod
    def get_queryset(cls, parent, info, **kwargs):
        query = Q(owner__isnull=True)
        if info.context.user.is_authenticated:
            query |= Q(owner=info.context.user.pk)
        return Watchlist.objects.filter(query)

    @staticmethod
    def resolve_assets(parent, info, **kwargs):
        if parent.type == WatchlistTypeEnum.DYNAMIC:
            return Asset.objects.filter(pk__in=get_dynamic_assets(parent.dynamic))
        else:
            return parent.assets

class PortfolioType(DjangoCRUDObjectType):
    class Meta:
        model = Portfolio

    @classmethod
    def get_queryset(cls, parent, info, **kwargs):
        query = Q(owner__isnull=True)
        if info.context.user.is_authenticated:
            query |= Q(owner=info.context.user.pk)
        return Portfolio.objects.filter(query)

class TagType(DjangoCRUDObjectType):
    class Meta:
        model = Tag

class WatchlistUIType(DjangoCRUDObjectType):
    class Meta:
        model = WatchlistUI

class Query(graphene.ObjectType):
    watchlists = WatchlistType.BatchReadField()
    portfolios = PortfolioType.BatchReadField()
    assets = AssetType.BatchReadField()
    tags = TagType.BatchReadField()
    users = UserType.BatchReadField()
    watchlist_uis = WatchlistUIType.BatchReadField()

    # user = UserType.ReadField()



class Mutation(graphene.ObjectType):
    watchlist_create = WatchlistType.CreateField()
    watchlist_update = WatchlistType.UpdateField()
    watchlist_delete = WatchlistType.DeleteField()

    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(
        query=Query,
        mutation=Mutation,
        auto_camelcase=False,)
