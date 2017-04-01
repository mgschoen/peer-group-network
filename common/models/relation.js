'use strict';

function personsIdentical (a, b) {
  var aPersons = a.personId,
      bPersons = b.personId;
  if (!aPersons && !bPersons) return true;
  if (!aPersons || !bPersons) return false;
  for (var i=0; i<aPersons.length; i++) {
    var c = aPersons[i];
    if (bPersons.indexOf(c) < 0) {
      return false;
    }
  }
  for (var j=0; j<bPersons.length; j++) {
    var d = bPersons[j];
    if (aPersons.indexOf(d) < 0) {
      return false;
    }
  }
  return true;
}

module.exports = function(Relation) {

  Relation.observe('before save', function(context, next) {

    var instance = context.instance,
        instancePersons = instance.personId,
        instanceKeyframe = instance.keyframeId,
        instanceType = instance.relationTypeId;

    var existingRelations;

    if (!instanceKeyframe || !instanceType || !instancePersons) {
      return next(new Error('Minimum requirements not fulfilled: Relation must have keyframe,'+
        ' relationType and persons'), null);
    }
    if (instancePersons.length !== 2) {
      return next(new Error('Relation must have exactly two persons referenced'), null);
    }

    Relation.find({}, function(err, relationSearchResult){

      if (err) return next(new Error(err.message), null);

      existingRelations = relationSearchResult;
      var relationsWithSamePersons = [];
      existingRelations.forEach(function(relation){
        if (personsIdentical(instance, relation)) {
          relationsWithSamePersons.push(relation);
        }
      });

      if (relationsWithSamePersons.length > 0) {
        var relationsWithSamePersonsAndKeyframe = [];

        relationsWithSamePersons.forEach(function(relation){
          if (relation.keyframeId.toString() == instanceKeyframe) {
            relationsWithSamePersonsAndKeyframe.push(relation);
          }
        });

        if (relationsWithSamePersonsAndKeyframe.length > 0) {
          var identicalRelations = [];
          relationsWithSamePersonsAndKeyframe.forEach(function(relation){
            if (relation.relationTypeId.toString() == instanceType) {
              identicalRelations.push(relation);
            }
          });
          if (identicalRelations.length > 0) {
            return next(new Error('Cannot store relation. Relation already exists.'), null);
          }
        }
      }

      next();
    });
  });
};
