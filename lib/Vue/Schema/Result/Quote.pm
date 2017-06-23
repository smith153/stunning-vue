use utf8;
package Vue::Schema::Result::Quote;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Vue::Schema::Result::Quote

=cut

use strict;
use warnings;


=head1 BASE CLASS: L<Vue::Schema::Result>

=cut

use base 'Vue::Schema::Result';

=head1 TABLE: C<quote>

=cut

__PACKAGE__->table("quote");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 created

  data_type: 'text'
  is_nullable: 0

=head2 description

  data_type: 'text'
  is_nullable: 0

=head2 price

  data_type: 'real'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "id",
  { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
  "created",
  { data_type => "text", is_nullable => 0 },
  "description",
  { data_type => "text", is_nullable => 0 },
  "price",
  { data_type => "real", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");

=head1 RELATIONS

=head2 quote_items

Type: has_many

Related object: L<Vue::Schema::Result::QuoteItem>

=cut

__PACKAGE__->has_many(
  "quote_items",
  "Vue::Schema::Result::QuoteItem",
  { "foreign.quote_id" => "self.id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07047 @ 2017-06-12 15:24:26
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:REMy8b8nCqKj3pCsXzN38A


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
