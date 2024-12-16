"""Initial migration

Revision ID: 71ecc688454d
Revises: db11559a9fc3
Create Date: 2024-12-15 20:56:08.512408

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '71ecc688454d'
down_revision: Union[str, None] = 'db11559a9fc3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
     op.create_table('converstation',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('summary', sa.String(length=250), nullable=True),
        sa.Column('converstation_id', sa.String(length=250), nullable=True),
        sa.Column('expert', sa.String(length=250), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), onupdate=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('converstation')
