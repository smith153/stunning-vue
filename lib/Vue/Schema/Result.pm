use strict;
use warnings;

package Vue::Schema::Result;

use base 'DBIx::Class::Core';

sub TO_JSON { +{ shift->get_columns } }

1;
