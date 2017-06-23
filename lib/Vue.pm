package Vue;
use Dancer2;
use Dancer2::Plugin::DBIC;
use Vue::API::Quote;

our $VERSION = '0.1';

prefix undef;

get '/' => sub {
    template 'index' => { 'title' => 'Vue' };
};


1;
