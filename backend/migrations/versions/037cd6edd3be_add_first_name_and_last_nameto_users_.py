"""Add first_name and last_nameto users table

Revision ID: 037cd6edd3be
Revises: 
Create Date: 2025-07-01 20:58:03.948147

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '037cd6edd3be'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_name', sa.String(length=100), nullable=False))
        batch_op.add_column(sa.Column('last_name', sa.String(length=100), nullable=False))
        batch_op.add_column(sa.Column('access_token', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('refresh_token', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('token_expires_at', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('profile_picture', sa.String(length=255), nullable=False))
        batch_op.drop_constraint(batch_op.f('users_username_key'), type_='unique')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.create_unique_constraint(batch_op.f('users_username_key'), ['username'], postgresql_nulls_not_distinct=False)
        batch_op.drop_column('profile_picture')
        batch_op.drop_column('token_expires_at')
        batch_op.drop_column('refresh_token')
        batch_op.drop_column('access_token')
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')

    # ### end Alembic commands ###
