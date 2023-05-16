import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphene_django_crud.types import DjangoCRUDObjectType, resolver_hints
from investigator.user.models import User, Watchlist
from investigator.oracle.models import Asset, AssetInfo

class UserType(DjangoCRUDObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class WatchlistType(DjangoCRUDObjectType):
    class Meta:
        model = Watchlist
        convert_choices_to_enum = False

    @classmethod
    def get_queryset(cls, parent, info, **kwargs):
        query = Q(owner__isnull=True)
        if info.context.user.is_authenticated:
            query |= Q(owner=info.context.user.pk)
        return Watchlist.objects.filter(query)

class AssetType(DjangoCRUDObjectType):
    class Meta:
        model = Asset

class Query(graphene.ObjectType):
    watchlists = WatchlistType.BatchReadField()
    assets = AssetType.BatchReadField()

    # user = UserType.ReadField()
    # users = UserType.BatchReadField()



class Mutation(graphene.ObjectType):
    watchlist_create = WatchlistType.CreateField()
    watchlist_update = WatchlistType.UpdateField()
    watchlist_delete = WatchlistType.DeleteField()

schema = graphene.Schema(query=Query, mutation=Mutation)
