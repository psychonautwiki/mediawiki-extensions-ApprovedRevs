( function () {
	$( function () {
		var approvelinks = $( '.approvelink[data-mw="interface"] a' );
		approvelinks.on( 'click', function ( e ) {
			var spinner, oldid, apiRequest;

			// Preload the notification module for mw.notify
			mw.loader.load( 'mediawiki.notification' );

			// Hide the link and create a spinner to show it inside the brackets.
			spinner = $.createSpinner( {
				size: 'small',
				type: 'inline'
            } );

			$( this ).hide().after( spinner );

			oldid = mw.util.getParamValue( 'oldid', this.href );
			apiRequest = new mw.Api();

			apiRequest.postWithToken( {
				action: 'csrf',
				revid: oldid
			} ).done( function ( data ) {
				var title;
				// Remove all approvelinks from the page (including any spinners inside).
				approvelinks.closest( '.approvelink' ).remove();
				if ( data.approve !== undefined ) {
					// Success
					title = new mw.Title( data.patrol.title );
					mw.notify( "Revision was successfully approved." );
				} else {
					// This should never happen as errors should trigger fail
					mw.notify( "Something went wrong.", { type: 'error' } );
				}
			} ).fail( function ( error ) {
				spinner.remove();
				// Restore the patrol link. This allows the user to try again
				// (or open it in a new window, bypassing this ajax module).
				approvelinks.show();

                mw.notify( "Something went wrong.", { type: 'error' } );
			} );

			e.preventDefault();
		} );
	} );
}() );
