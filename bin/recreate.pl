#!/usr/bin/env perl
use warnings;
use strict;

use DBIx::Class::Schema::Loader qw( make_schema_at );
use lib './lib';

my $lib_dir  = './lib';
my $lib_name = 'Vue';

my $out_path = "$lib_dir/$lib_name/Schema.pm";



make_schema_at(
    $lib_name . '::Schema',
    {
        use_namespaces          => 1,
        dump_directory          => $lib_dir,
        result_base_class       => 'Vue::Schema::Result',
        overwrite_modifications => 0,
    },
    [ "dbi:SQLite:dbname=vue.db" ],
);
