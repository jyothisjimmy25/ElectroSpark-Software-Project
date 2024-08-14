# Import necessary modules
from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory
import sqlite3 as sql

# Initialize Flask app
app = Flask(__name__)
app.secret_key = "admin123"

# Define the path to the external HTML folder
external_html_folder = r'C:\Users\USER\Desktop\HTML-Form-Submission-Mail-Google-sheet-master'


@app.route('/')
def index():
    return render_template('index.html')

# Route to serve the indexes.html file
@app.route('/indexes')
def indexes():
    return send_from_directory(external_html_folder, 'indexes.html')

@app.route('/indexes.css')
def indexes_css():
    return send_from_directory(external_html_folder, 'indexes.css')

@app.route('/Main')
def main():
    # Check if the user is logged in
    if 'username' in session:
        # If logged in, get the username from the session
        username = session['username']
        return render_template('main.html', username=username)
    else:
        # If not logged in, redirect to sign-in page
        return redirect(url_for('signin'))

@app.route('/Profile')
def profile():
    if 'username' in session:
        username = session['username']
        con = sql.connect('Electrospark.db')
        cur = con.cursor()
        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cur.fetchone()
        con.close()
        if user:
            return render_template('profile.html', user=user, username=username)
        else:
            flash('User data not found.', 'error')
            return redirect(url_for('main'))
    else:
        flash('Please sign in to view your profile.', 'error')
        return redirect(url_for('signin'))

@app.route('/update_profile', methods=['POST'])
def update_profile():
    if 'username' in session:
        username = session['username']
        fullname = request.form['fullname']
        dob = request.form['dob']
        role = request.form['role']
        
        con = sql.connect('Electrospark.db')
        cur = con.cursor()
        cur.execute("UPDATE users SET fullname = ?, dob = ?, role = ? WHERE username = ?", (fullname, dob, role, username))
        con.commit()
        con.close()
        
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('profile'))
    else:
        flash('Please sign in to update your profile.', 'error')
        return redirect(url_for('signin'))

# Route to handle changing password
@app.route('/change_password', methods=['POST'])
def change_password():
    if 'username' in session:
        username = session['username']
        new_password = request.form['new_password']  # Updated to 'new_password'
        
        con = sql.connect('Electrospark.db')
        cur = con.cursor()
        cur.execute("UPDATE users SET password = ? WHERE username = ?", (new_password, username))
        con.commit()
        con.close()
        
        flash('Password changed successfully!', 'success')
        return redirect(url_for('profile'))
    else:
        flash('Please sign in to change your password.', 'error')
        return redirect(url_for('signin'))

@app.route('/Experiments')
def experiments():
    # Check if the user is logged in
    if 'username' in session:
        # If logged in, get the username from the session
        username = session['username']
        return render_template('experiments.html', username=username)
    else:
        # If not logged in, redirect to sign-in page
        return redirect(url_for('signin'))

@app.route('/About')
def about():
    # Check if the user is logged in
    if 'username' in session:
        # If logged in, get the username from the session
        username = session['username']
        return render_template('about.html', username=username)
    else:
        # If not logged in, redirect to sign-in page
        return redirect(url_for('signin'))

@app.route('/Contact')
def contact():
    # Check if the user is logged in
    if 'username' in session:
        # If logged in, get the username from the session
        username = session['username']
        return render_template('contact.html', username=username)
    else:
        # If not logged in, redirect to sign-in page
        return redirect(url_for('signin'))

@app.route('/Experiment1')
def experiment1():
    if 'username' in session:
        # If logged in, get the username from the session
        username = session['username']
        return render_template('experiment1.html', username=username)
    else:
        # If not logged in, redirect to sign-in page
        return redirect(url_for('signin'))

@app.route('/Aim')
def aim():
    if 'username' in session:
        # If logged in, get the username from the session
        username = session['username']
        return render_template('aim.html', username=username)
    else:
        # If not logged in, redirect to sign-in page
        return redirect(url_for('signin'))

@app.route('/Procedure')
def procedure():
    if 'username' in session:
        # If logged in, get the username from the session
        username = session['username']
        return render_template('procedure.html', username=username)
    else:
        # If not logged in, redirect to sign-in page
        return redirect(url_for('signin'))

@app.route('/Principle')
def principle():
    if 'username' in session:
        # If logged in, get the username from the session
        username = session['username']
        return render_template('principle.html', username=username)
    else:
        # If not logged in, redirect to sign-in page
        return redirect(url_for('signin'))

@app.route('/Circuit')
def circuit():
    return render_template('circuit.html')

@app.route('/Signin')
def signin():
    return render_template('signin.html')

# Route to handle form submission from signin page
@app.route('/submit_signin', methods=['POST'])
def submit_signin():
    if request.method == 'POST':
        username_or_email = request.form['username']
        password = request.form['password']

        con = sql.connect('Electrospark.db')
        cur = con.cursor()

        # Check if the username or email exists
        cur.execute("SELECT * FROM users WHERE username = ? OR email = ?", (username_or_email, username_or_email))
        user = cur.fetchone()

        if user:
            # If user exists, check if the password matches
            if user[4] == password:
                # If password matches, store username in session
                session['username'] = user[1]  # Store the username in session
                # Redirect to main.html
                return redirect(url_for('main'))
            else:
                # If password doesn't match, show error message
                flash('Incorrect password. Please try again.', 'error')
                return redirect(url_for('signin'))
        else:
            # If username or email not found, show error message
            flash('User does not exist. Please sign up.', 'error')
            return redirect(url_for('signup'))
    else:
        return redirect(url_for('signin'))

# Routes

# Route to render signup page
@app.route('/Signup')
def signup():
    return render_template('signup.html')

# Function to insert user data into the database
def insert_user(username, fullname, email, password, dob, role):
    con = sql.connect('Electrospark.db')
    cur = con.cursor()
    cur.execute("INSERT INTO users (username, fullname, email, password, dob, role) VALUES (?, ?, ?, ?, ?, ?)",
                (username, fullname, email, password, dob, role))
    con.commit()
    con.close()

# Route to handle form submission from signup page
@app.route('/submit_signup', methods=['POST'])
def submit_signup():
    if request.method == 'POST':
        username = request.form['username']
        fullname = request.form['fullname']
        email = request.form['email']
        password = request.form['password']
        dob = request.form['dob']
        role = request.form['role']

        # Insert user data into the database
        insert_user(username, fullname, email, password, dob, role)

        flash('Account created successfully!', 'success')
        return redirect(url_for('signin'))
    else:
        return redirect(url_for('signup'))

# Route to handle user logout
@app.route('/logout')
def logout():
    # Clear the session
    session.clear()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('signin'))

# Clear flashed messages after displaying them
@app.before_request
def clear_flashed_messages():
    session.modified = True

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
