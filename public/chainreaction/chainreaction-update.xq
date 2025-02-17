declare namespace chain="http://mansoft.nl/chain";
declare namespace xlink="http://www.w3.org/1999/xlink";
declare namespace svg="http://www.w3.org/2000/svg";

declare variable $model external;

declare function local:click($use, $evtObj) {
  let
    $field := $model/chain:chain-game/chain:field
    , $unvisited := $field[@state = 'unvisited']
    , $new-field := $field[@row = $use/@chain:row][@column = $use/@chain:column]
    , $current-field := $field[@state = 'current']
    , $current-row := $current-field/@row
    , $current-col := $current-field/@column
    , $new-row := $new-field/@row
    , $new-col := $new-field/@column
    , $current-svg-color := $use/../svg:use[@chain:row = $current-row][@chain:column = $current-col]/@color
    , $new-svg-color := $use/@color

  return
  if ($new-field/@state = 'current') then 
    b:alert('Same position')
  else if ($new-row != $current-row and $new-col != $current-col) then
    b:alert('Bad move: Stay in row or column')
  else if ($new-field/@state = 'visited') then
    b:alert('Bad move: Already been there')
  else if ($new-field/@shape != $current-field/@shape and $new-field/@color != $current-field/@color) then
    b:alert('Bad move: Must match colour or shape')
  else
  (
    if (count($unvisited) = 1) then b:alert('Solved!') else (),
    replace value of node $current-field/@state with 'visited',
    replace value of node $new-field/@state with 'current',
    replace value of node $current-svg-color with 'white',
    replace value of node $new-svg-color with 'black',
  )
};

for $use in svg:g[@id = 'game']/svg:use[@xlink:href != '#empty']
return b:addEventListener($use, "click", local:click#2)
