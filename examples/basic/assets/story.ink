VAR preset = "default"
VAR mat = false



-> find_help

=== find_help ===

	You search desperately for a friendly face in the crowd. 
	*	The woman in the hat[?] pushes you roughly aside. # woman
	    ~ preset = "volcano"
	    -> find_help  
	    
	*	The man with the briefcase[?] looks disgusted as you stumble past him. # man
	    ~ preset = "forest" 
	    -> find_help
	*	->
		But it is too late: you collapse onto the station platform. This is the end.
		~ preset = "tron"
		-> END