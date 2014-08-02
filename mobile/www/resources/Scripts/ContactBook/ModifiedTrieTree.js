function ModifiedTrieTree(){
  var self = this;
  
  self.add = Add;
  self.has = HasProperty;
  self.getSuggestions = GetSuggestions;
  self.__getRoot__ = GetRoot;
  
  var root = {};
  
  
  function GetSuggestions(item){
    return _GetSuggestions(root, (item || '').toLowerCase(), {});
  }
  function _GetSuggestions(node, item, usedvalues){
    if(item.length == 0){
      var array = [];
      if(node.end && !usedvalues[node.value]){
        array.push(node.value);
        usedvalues[node.value] = true;
      }
      for(var letter in node){
        if(letter == 'end' || letter == 'value')
          continue;
        array = array.concat(_GetSuggestions(node[letter], item, usedvalues));
      }
      return array;
    }else{
      var letter = item[0],
          rest = item.substring(1);
      if(!node.hasOwnProperty(letter))
        return [];
      return _GetSuggestions(node[letter], rest, usedvalues);
    }
  }
  
  
  function Add(contact){
    var full = (!!contact.firstname?contact.firstname:'')+' '+(!!contact.lastname?contact.lastname:'');
    
    if(!!contact.lastname)
      _Add(root, contact.lastname, full);
    
    if(!!contact.firstname)
      _Add(root, contact.firstname, full);
    
    if(!!contact.emails)
      for(var i=0,email; email=contact.emails[i++];)
        _Add(root, email.value, full+' <'+email.value+'>');
    
    if(!!contact.numbers)
      for(var i=0,number; number=contact.numbers[i++];)
        _Add(root, number.value, full+' ('+number.value.slice(0,3)+' '+number.value.slice(3,6)+'-'+number.value.slice(6,10)+')');
    
    _Add(root, full, full);
  }
  function _Add(node, item, value){
    if(node == root)
      item = item.toLowerCase();
    if(item.length == 0)
      return;
    var letter = item[0],
        rest = item.substring(1);
    if(!node.hasOwnProperty(letter))
      node[letter] = {end:false, value:value};
    if(rest.length == 0)
      node[letter].end = true;
    _Add(node[letter], rest, value);
  }
  
  
  function GetRoot(){
    return root;
  }
  
  
  function HasProperty(prop){
    return _HasProperty(root, prop)
  }
  function _HasProperty(node, prop){
    if(prop.length == 0)
      return false;
    var letter = prop[0],
        rest = prop.substring(1);
    if(!node.hasOwnProperty(letter))
      return false;
    if(rest.length == 0)
      return node[letter].end;
    return _HasProperty(node[letter], rest);
  }
  
}