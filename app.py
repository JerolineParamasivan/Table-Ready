from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
	return render_template('index.html')


<<<<<<< Updated upstream
@app.route('/admin/bookings')
def admin_bookings():
	return render_template('admin_dashboard.html')
=======
@app.route('/confirmation')
def confirmation():
	return render_template('confirmation.html')
>>>>>>> Stashed changes


if __name__ == '__main__':
	app.run(debug=True)
