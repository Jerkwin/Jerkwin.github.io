#!/usr/bin/perl -w

use strict;

# opens a generic .sh file and replaces the values of
# relevant environment variable (LAMBDA) in increments
# of 1 

unless (@ARGV) {
    die "Usage: $0 input.sh\n";
}

my $sh = $ARGV[0];

my @temp = split('\.', $sh);
my $base = $temp[0];

open(IN, "<$sh");
my @in = <IN>;
close(IN);

for (my $i=0; $i<21; $i++) {

    my $filename = "${base}_${i}.sh";

    open(OUT, ">$filename");

    foreach $_ (@in) {
        unless ($_ =~ /^LAMBDA=/) {
            print OUT $_;
        }

        if ($_ =~ /^LAMBDA=/) {
            printf OUT "%s%d\n", $&, $i;
        }
    }
    close(OUT);
}

exit;
