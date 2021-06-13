#################### IMPORTS ####################
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


#################### FUNCTIONS ####################


#################### CLASSES ####################
class EditForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired()])
    firstname = StringField('firstname')
    lastname = StringField('lastname')
    profile_photo = StringField('profile_photo')
