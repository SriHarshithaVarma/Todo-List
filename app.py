import os
from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'tasks.db')
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(20), nullable=False)
    completed = db.Column(db.Boolean, default=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    task_list = [{'id': task.id, 'name': task.name, 'date': task.date, 'category': task.category, 'completed': task.completed} for task in tasks]
    return jsonify(task_list)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    new_task = request.json
    task = Task(name=new_task['name'], date=new_task['date'], category=new_task['category'])
    db.session.add(task)
    db.session.commit()
    return jsonify({'message': 'Task added successfully'})

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if task:
        task.completed = not task.completed
        db.session.commit()
        return jsonify({'message': 'Task updated successfully'})
    return jsonify({'message': 'Task not found'})

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'})
    return jsonify({'message': 'Task not found'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
