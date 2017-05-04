'use strict';

function personsIdentical (a, b) {
  var aPersonA = a.personAId.toString(),
      aPersonB = a.personBId.toString(),
      bPersonA = b.personAId.toString(),
      bPersonB = b.personBId.toString();
  if (aPersonA == bPersonA) {
    console.log("aA == bA");
    if (aPersonB == bPersonB) return true;
  }
  if (aPersonA == bPersonB) {
    console.log("aA == bB");
    if (aPersonB == bPersonA) return true;
  }
  if (aPersonB == bPersonA) {
    console.log("aB == bA");
    if (aPersonA == bPersonB) return true;
  }
  if (aPersonB == bPersonB) {
    console.log("aB == bB");
    if (aPersonA == bPersonA) return true;
  }
  return false;
}

module.exports = function(Relation) {

  Relation.observe('before save', function(context, next) {

    var instance = context.instance,
        instancePersonA = instance.personAId,
        instancePersonB = instance.personBId,
        instanceKeyframe = instance.keyframeId,
        instanceType = instance.relationTypeId;

    var existingRelations;

    if (!instanceKeyframe || !instanceType || !instancePersonA || !instancePersonB) {
      return next(new Error('Minimum requirements not fulfilled: Relation must have keyframe,'+
        ' relationType and persons'), null);
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
