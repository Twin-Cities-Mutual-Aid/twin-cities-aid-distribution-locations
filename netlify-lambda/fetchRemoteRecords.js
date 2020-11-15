const Airtable = require('airtable')

// Transform a raw airtable record into a format appropriate for
// the TCMAP website, eg. hide private fields.
// This is derived from `extractRawLocation` function in index.js.
prepareResult = function(record) {
  return {
    name: record.fields.org_name,
    neighborhood: record.fields.neighborhood_name,
    address: record.fields.address,
    longitude: record.fields.longitude,
    latitude: record.fields.latitude,
    mostRecentlyUpdatedAt: record.fields.last_updated,
    currentlyOpenForDistributing: record.fields.currently_open_for_distributing,
    openingForDistributingDonations: record.fields.opening_for_distributing_donations,
    closingForDistributingDonations: record.fields.closing_for_distributing_donations,
    currentlyOpenForReceiving: record.fields.currently_open_for_receiving,
    openingForReceivingDonations: record.fields.opening_for_receiving_donations,
    closingForReceivingDonations:  record.fields.closing_for_receiving_donations,
    urgentNeed: record.fields.urgent_need,
    seekingMoney: record.fields.seeking_money,
    seekingMoneyURL: record.fields.seeking_money_url,
    accepting: record.fields.accepting,
    notAccepting: record.fields.not_accepting,
    seekingVolunteers: record.fields.seeking_volunteers,
    notes: record.fields.notes,
    color: record.fields.color
  }
}

validateRecord = function(record) {
  const has_org = record.fields.org_name !== ''
  const has_lng = record.fields.longitude !== undefined
  const has_lat = record.fields.latitude !== undefined
  const has_color = record.fields.color !== undefined

  return has_org && has_lng && has_lat && has_color
}

fetchRecords = async function(query) {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseName = process.env.AIRTABLE_BASE_NAME
  const base = new Airtable({apiKey}).base(baseName)

  return base('mutual_aid_locations')
  .select(query)
  .all()
  .then( function(records) {
    return records
    .filter(validateRecord)
    .map(prepareResult)
  })
}

exports.handler = async function(event) {
  // default sorting/filtering, eventually use `event` data to override.
  const field = 'org_name'
  const direction = 'asc'
  const query = {
    sort: [{field, direction}],
  }

  // fetch data from airtable
  const result = await fetchRecords(query)

  // this does little or no error handling right now!
  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {'content-type': 'application/json'}
  }
}
