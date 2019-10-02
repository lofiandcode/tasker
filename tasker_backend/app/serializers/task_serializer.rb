class TaskSerializer < ActiveModel::Serializer
  attributes :id, :text, :state
  has_one :user
end
