"""initial database

Revision ID: b9049e721321
Revises: 
Create Date: 2023-08-15 19:55:29.348011

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b9049e721321'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('apartment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('url', sa.String(length=255), nullable=False),
    sa.Column('locality', sa.String(length=100), nullable=False),
    sa.Column('price', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('image',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(length=255), nullable=False),
    sa.Column('apartment_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['apartment_id'], ['apartment.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('image')
    op.drop_table('apartment')
    # ### end Alembic commands ###
