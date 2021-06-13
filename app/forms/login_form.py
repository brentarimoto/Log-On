#################### IMPORTS ####################
## DEPENDENCIES
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError

## FILES
from app.models import User

#################### FUNCTIONS ####################
def user_exists(form, field):
    # print("Checking if user exists", field.data)
    credential = field.data
    user = User.query.filter((User.email==credential) | (User.username==credential)).first()
    if not user:
        raise ValidationError("Username/Email provided not found.")


def password_matches(form, field):
    # print("Checking if password matches")
    password = field.data
    credential = form.data['credential']
    user = User.query.filter((User.email==credential) | (User.username==credential)).first()
    if not user:
        raise ValidationError("Credentials and password given do not match.")
    if not user.check_password(password):
        raise ValidationError("Credentials and password given do not match.")


#################### CLASSES ####################
class LoginForm(FlaskForm):
    credential = StringField('credential', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[
                           DataRequired(), password_matches])
