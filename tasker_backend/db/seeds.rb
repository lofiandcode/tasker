# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

knut = User.create(name: "Knut");
sarah = User.create(name: "Sarah");

Task.create(text: 'Knut Task 1', state: "To Do", user_id: knut.id);
Task.create(text: 'Knut Task 2', state: 'Working', user_id: knut.id);
Task.create(text: 'Knut Task 3', state: 'Working', user_id: knut.id);
Task.create(text: 'Knut Task 4', state: "Done", user_id: knut.id);
Task.create(text: 'Sarah Task 1', state: "To Do", user_id: sarah.id);
Task.create(text: 'Sarah Task 2', state: "To Do", user_id: sarah.id);
Task.create(text: 'Sarah Task 3', state: "Working", user_id: sarah.id);
Task.create(text: 'Sarah Task 4', state: "Working", user_id: sarah.id);
Task.create(text: 'Sarah Task 5', state: "Done", user_id: sarah.id);

puts "Seeds done."