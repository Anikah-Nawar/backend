package com.example.Dashboard;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class AverageDataService {

    private final InfluxDBClient influxDBClient;

    public AverageDataService() {
        String token = "UnqbM0RIzFJGRPSyunJATob0F-WYsF3kX2M6y3i2NN-q4wJqUMGknwoxQjc0a8nZdAEru-OXHFGi2hkOt6xthA==";
        String org = "Tester";
        String url = "https://us-east-1-1.aws.cloud2.influxdata.com?readTimeout=60000"; //?readTimeout=60000 was added to prevent the timeout that was happening
        this.influxDBClient = InfluxDBClientFactory.create(url, token.toCharArray(), org);
    }

    public Map<String, List<Map<String, Object>>> getAveragesLast24h() {
        QueryApi queryApi = influxDBClient.getQueryApi();

        String[] fields = {"temperature", "humidity", "pressure", "iaq"};
        Map<String, List<Map<String, Object>>> result = new HashMap<>();

        for (String field : fields) {
            // ⚙️ Update this measurement name if needed!
            //|> group(columns: ["_time"]) |> mean() ensures you’re averaging across all sensors per minute.
            //Returns clean ISO-formatted timestamps (Instant.toString())
            //Adds debug prints to confirm you’re actually getting points.
            //Handles missing values safely.
            //Sorts by time for smoother graph rendering
            String flux = String.format("""
                from(bucket: "Sensors")
                  |> range(start: -24h)
                  |> filter(fn: (r) => r._field == "%s")
                  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
                  |> group(columns: ["_time"])
                  |> mean()
                  |> yield(name: "mean")
            """, field);

            List<FluxTable> tables = queryApi.query(flux);
            List<Map<String, Object>> points = new ArrayList<>();

            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    Instant time = record.getTime();
                    Object value = record.getValue();

                    if (time != null && value != null) {
                        Map<String, Object> point = new HashMap<>();
                        point.put("time", time.toString());
                        point.put("value", value);
                        points.add(point);
                    }
                }
            }

            // Sort points by time (helps charts render properly)
            points.sort(Comparator.comparing(p -> (String) p.get("time")));
            result.put(field, points);

            System.out.println("Loaded " + points.size() + " points for " + field);
        }

        return result;
    }
}
