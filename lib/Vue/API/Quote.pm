package Vue::API::Quote;
use Dancer2 appname => 'Vue';
use Dancer2::Plugin::DBIC;
use Data::Dumper;
use Time::Piece;

our $VERSION = '0.1';

prefix '/api';

get '/quote' => sub {

    my @quotes = rset('Quote')->search(
        {},
        {
            prefetch     => ['quote_items'],
            order_by     => { '-desc' => 'me.id' },
            result_class => 'DBIx::Class::ResultClass::HashRefInflator',
        }
    )->all();

    #warn Dumper to_json( \@quotes );

    return to_json( \@quotes );
};

post '/quote' => sub {
    my $params = from_json( request->body );
    warn Dumper $params;
    my $quote;

    $params->{created} = localtime->strftime("%F");

    eval { $quote = rset('Quote')->create($params); };

    warn $@ if $@;
    return to_json( { success => $quote ? 1 : 0 } );

};

post '/quote/:id' => sub {
    my $params = from_json( request->body );
    warn Dumper $params;
    my $quote;

    eval {
        schema->txn_do(
            sub {
                $quote =
                  rset('Quote')->search( { id => params->{id} } )->next();
                foreach my $item ( @{ delete $params->{quote_items} } ) {
                    my $qitem = rset('QuoteItem')->find( $item->{id} );
                    next unless $qitem;
                    $qitem->update($item);

                }

                $quote->update($params);

            }
        );
    };

    warn $@ if $@;
    return to_json( { success => $quote ? 1 : 0 } );

};

del '/quote/:id' => sub {
    my $quote;
    eval {
        $quote =
          rset('QuoteItem')->search( { quote_id => params->{id} } )->delete();
        $quote = rset('Quote')->search( { id => params->{id} } )->delete();
    };
    warn $@ if $@;
    return to_json( { success => $quote ? 1 : 0 } );
};

1;
