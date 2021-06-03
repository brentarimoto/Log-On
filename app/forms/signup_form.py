#################### IMPORTS ####################
## DEPENDENCIES
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError

## FILES
from app.models import User


#################### FUNCTIONS ####################
def username_exists(form, field):
    print("Checking if user exits", field.data)
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError("Username is already taken.")

def email_exists(form, field):
    print("Checking if user exits", field.data)
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError("Email is already in use.")


#################### CLASS ####################
class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), email_exists])
    password = StringField('password', validators=[DataRequired()])
    firstname = StringField('firstname')
    lastname = StringField('lastname')
    profile_photo = StringField('profile_photo')
