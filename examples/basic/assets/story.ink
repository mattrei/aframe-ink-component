VAR preset = "default"
VAR mat = false



-> find_help

=== find_help ===

	Where do you want to be?. 
	*	At a volcano!. # woman
	    ~ preset = "volcano"
	    -> find_help  
	    
	*	In the forest. # man
	    ~ preset = "forest" 
	    -> find_help
	*	->
		But it is too late: you end up on the Tron. This is the end.
		~ preset = "tron"
		-> END