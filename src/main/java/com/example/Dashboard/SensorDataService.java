package com.example.Dashboard;

import org.json.JSONException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxTable;
import com.influxdb.query.FluxRecord;
import org.json.JSONObject;
import java.util.List;

@Service
public class SensorDataService {

    private final SensorDataController controller;

    // InfluxDB credentials
    private static final String url = "https://us-east-1-1.aws.cloud2.influxdata.com?readTimeout=60000";//?readTimeout=60000 was added to prevent the timeout that was happening
    private static final String token = "UnqbM0RIzFJGRPSyunJATob0F-WYsF3kX2M6y3i2NN-q4wJqUMGknwoxQjc0a8nZdAEru-OXHFGi2hkOt6xthA==";
    private static final String org = "Tester";
    private static final String bucket = "Sensors";

    private final InfluxDBClient influxDBClient;
    private final QueryApi queryApi;

    public SensorDataService(SensorDataController controller) {
        this.controller = controller;
        this.influxDBClient = InfluxDBClientFactory.create(url, token.toCharArray(), org, bucket);
        this.queryApi = influxDBClient.getQueryApi();
    }

    /*TODO: UNDER MAINTAINENCE, FOR NOW i PATCH WORKED IT COUNTING ALL THE TEMP POSTS
    PER MIN BUT, THAT IS PATCHWORK, i CAN'T SEEM TO GET THE UNIQUE TIMESTAMPS SO i CAN'T SEE THE UNIQUE MINS
    GOTTA THINK OF HOW TO FIX THAT, MAYBE GET THE SENSORS TO SEND THE TIMES THAT THEY ARE SENDING THE DATA ALONG WITH THE DATA
    SO BASICALLY IF I SEND 2 POINTS IN 1 MIN THEY THINK THAT AS INCREASE PERFORMANCE AND IF ITS OUT OF 10 MINS THAT IS 20%,
    NOT WHAT I WANTED BUT IF I ASSUME THE SENSORS SEND ATMOST 1 POINT PER MIN THEN IT WORKS
     */
    private int calculateSensorPerformance(String sensorId) {
        String flux = String.format("""
            from(bucket: "%s")
              |> range(start: -10m)
              |> filter(fn: (r) => r._measurement == "bme680" and r.sensor_id == "%s" and r._field == "temperature")
              |> count()""", bucket, sensorId);

        List<FluxTable> tables = queryApi.query(flux);
        int minutesWithData = 0;
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                Number val = (Number) record.getValue();
                if (val != null) {
                    minutesWithData += val.intValue();
                }
            }
        }

        //System.out.println("Sensor " + sensorId + " minutesWithData=" + minutesWithData);

        int expectedMinutes = 10;
        double performance = ((double) minutesWithData / expectedMinutes) * 100.0;
        return (int) Math.round(Math.min(performance, 100.0));
    }

    @Scheduled(fixedRate = 1000) // every seconds
    public void pushSensorData() throws JSONException {
        // Flux query to get the latest reading for all fields for all sensors
        String fluxQuery = "from(bucket:\"Sensors\") " +
                "|> range(start:-1h) " +
                "|> filter(fn:(r) => r._measurement==\"bme680\") " +
                "|> last()";

        List<FluxTable> tables = queryApi.query(fluxQuery);
        JSONObject allSensorsJson = new JSONObject();

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                String sensorId = record.getValueByKey("sensor_id").toString();
                String field = record.getField();
                Double value = ((Number) record.getValue()).doubleValue();

                // Create a nested JSON object for the sensor if it doesn't exist
                if (!allSensorsJson.has(sensorId)) {
                    allSensorsJson.put(sensorId, new JSONObject());
                }

                // Put the field and value into the sensor's object
                JSONObject sensorJson = allSensorsJson.getJSONObject(sensorId);
                sensorJson.put(field, value);
            }
        }


        // --- Add performance calculation ---
        for (String sensorId : allSensorsJson.keySet()) {
            try {
                int performance = calculateSensorPerformance(sensorId);
                allSensorsJson.getJSONObject(sensorId).put("performance", performance);
            } catch (Exception e) {
                allSensorsJson.getJSONObject(sensorId).put("performance", 0);
                e.printStackTrace();
            }
        }

        // Broadcast the combined JSON object for all sensors
        controller.broadcast(allSensorsJson.toString());
    }
}