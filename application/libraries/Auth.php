<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

	class Auth {
	
		var $ci;
		var $cfgTable;
		var $cfgColUser;
		var $cfgColPass;
		var $cfgPassType;
		var $cfgRedirLoginURL;

///////////////////////////////////////////////////////////////////////////////////////////////	
//// CONSTRUCTOR
///////////////////////////////////////////////////////////////////////////////////////////////	
		function __construct($tableName='slice_auth', $colUsername='username', $colPassword='password', $passwordType='plain', $ciInstance = '')
		{			
			if(!is_object($ciInstance))
			{
				$ciInstance =& get_instance();			
				
				// require session or LOAD it
				if(!isset($ciInstance->session))
				{
					$ciInstance->load->library('session');
				}

				// require database
				if(!isset($ciInstance->db))
				{
					show_error('Please load the Database library prior to loading Auth');
				}
			}

			// stash config info
			$this->cfgTable = $tableName;
			$this->cfgColUser = $colUsername;
			$this->cfgColPass = $colPassword;
			$this->cfgPassType = $passwordType;
			
			// stash ci 
			$this->ci =& $ciInstance;
		}
	
		function isAuthenticated()
		{
			// is first auth
			if(	$this->getUser() )
			{
				return true;
			}
			return false;
		}
		
		private function setUser($userObj)
		{
			$this->ci->session->set_userdata("raw_user",$userObj);
		}
		
		function getUser()
		{
			// check if authenticated
			$user = $this->ci->session->userdata("raw_user");
			
			// make sure it has user and pass col's
			if(	$user 
				&&	isset($user->{$this->cfgColUser})
				&&	isset($user->{$this->cfgColPass}))
			{
				return $user;
			}
			
			return null;
		}
		
		function requireLogin()
		{
			// NO auth'ed user in session ??
			if(!$this->getUser())
			{
				// is redir configured ?
				if(strlen($this->cfgRedirLoginURL))
				{
					redirect($this->cfgRedirLoginURL, 'location', 301);
					exit();
				}
				else
				{
					// reject with 403 Forbidden
					set_status_header(403);
					exit();
				}
			}
		}
		
		function logout($redirUrl = '', $redirStatus = 302)
		{
			$this->ci->session->sess_destroy();
			if(strlen($redirUrl))
				redirect($redirUrl, 'location', $redirStatus);
		}
	
		function login($user,$pass)
		{
			if(strlen($user) && strlen($pass))
			{
				switch($this->cfgPassType)
				{
					case "sha1":
						$dbpass = sha1($pass);
						break;
					case "md5":
						$dbpass = md5($pass);
						break;
					case "plain":
					default:
						$dbpass = $pass;				
				}
				
				// check against db
				$this->ci->db->where($this->cfgColPass,$dbpass);
				$this->ci->db->where($this->cfgColUser,$user);
				$query = $this->ci->db->get($this->cfgTable,1,0);
				$result = $query->row();
				
				// successful auth
				if($result && strcasecmp($result->{$this->cfgColUser}, $user) == 0)
				{
					// store user row
					$this->setUser($result);
					// return true
					return true;
				}
			}
			return false;
		}


///////////////////////////////////////////////////////////////////////////////////////////////	
//// SESSION / AUTH PROPERTIES (SET)
///////////////////////////////////////////////////////////////////////////////////////////////	
	   	public function __set($name, $value) {
	    	if(property_exists($this,$name))
	    	{
	    		$this->$name = $value;
	    	}
	    	else if(method_exists($this,$name))
	    	{
	    		// do nothing?
	    	}
			else
			{	
				if($value == null)
	    			$this->ci->session->unset_userdata('auth_' . $name);
				else	
	    			$this->ci->session->set_userdata('auth_' . $name,$value);
	    	}
	    }
	
///////////////////////////////////////////////////////////////////////////////////////////////	
//// SESSION / AUTH PROPERTIES (GET)
///////////////////////////////////////////////////////////////////////////////////////////////	
	    public function __get($name) {
	    	if(property_exists($this,$name))
	    	{
	    		return $this->$name;
	    	}
	    	else if(method_exists($this,$name))
	    	{
		    	return call_user_method_array($name,$this,func_get_args());
	    	}
			else
			{
	    		return $this->ci->session->userdata('auth_' . $name);
	    	}
	    }		
	}
	