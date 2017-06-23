use utf8;
package Vue::Schema::Result::QuoteItem;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Vue::Schema::Result::QuoteItem

=cut

use strict;
use warnings;


=head1 BASE CLASS: L<Vue::Schema::Result>

=cut

use base 'Vue::Schema::Result';

=head1 TABLE: C<quote_item>

=cut

__PACKAGE__->table("quote_item");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 quote_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=head2 name

  data_type: 'text'
  is_nullable: 0

=head2 price

  data_type: 'real'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "id",
  { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
  "quote_id",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
  "name",
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

=head2 quote

Type: belongs_to

Related object: L<Vue::Schema::Result::Quote>

=cut

__PACKAGE__->belongs_to(
  "quote",
  "Vue::Schema::Result::Quote",
  { id => "quote_id" },
  { is_deferrable => 0, on_delete => "NO ACTION", on_update => "NO ACTION" },
);


# Created by DBIx::Class::Schema::Loader v0.07047 @ 2017-06-12 15:24:26
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:swkSBzrBAOf4xL9y25u27w


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
