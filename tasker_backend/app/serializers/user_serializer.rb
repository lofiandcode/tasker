class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :tasks
end
