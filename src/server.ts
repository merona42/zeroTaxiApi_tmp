import express, { Request, Response } from 'express';
import { setupSwagger } from './swagger';
const app = express();
const port = 3000;
setupSwagger(app);
/**
 * @swagger
 * /public/{startLongitude},{startLatitude}/{endLongitude},{endLatitude}:
 *   get:
 *     summary: 대중교통 경로 정보 조회
 *     description: 출발지와 도착지의 경도, 위도를 기반으로 대중교통 길찾기 경로 조회
 *     parameters:
 *       - in: path
 *         name: startLongitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 출발지 경도
 *       - in: path
 *         name: startLatitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 출발지 위도
 *       - in: path
 *         name: endLongitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 도착지 경도
 *       - in: path
 *         name: endLatitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 도착지 위도
 *     responses:
 *       200:
 *         description: 대중교통 경로 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     busCount:
 *                       type: integer
 *                       description: 버스 결과 개수
 *                     subwayCount:
 *                       type: integer
 *                       description: 지하철 결과 개수
 *                     subwayBusCount:
 *                       type: integer
 *                       description: 버스+지하철 결과 개수
 *                     path:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           pathType:
 *                             type: integer
 *                             description: 1-지하철, 2-버스, 3-버스+지하철
 *                           info:
 *                             type: object
 *                             properties:
 *                               totalWalk:
 *                                 type: integer
 *                                 description: 총 도보 이동거리
 *                               totalTime:
 *                                 type: integer
 *                                 description: 총 소요시간
 *                               payment:
 *                                 type: integer
 *                                 description: 총 요금
 *                               firstStartStationKor:
 *                                 type: string
 *                                 description: 최초 출발역/정류장 국문
 *                               lastEndStationKor:
 *                                 type: string
 *                                 description: 최종 도착역/정류장 국문
 *                               subPath:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     trafficType:
 *                                       type: integer
 *                                       description: 이동 수단 종류 (1-지하철, 2-버스, 3-도보)
 *                                     sectionTime:
 *                                       type: integer
 *                                       description: 이동 소요 시간
 *                                     intervalTime:
 *                                       type: integer
 *                                       description: 평균 배차 간격 (분)
 *                                     startNameKor:
 *                                       type: string
 *                                       description: 승차 정류장/역명 국문
 *                                     startX:
 *                                       type: number
 *                                       format: double
 *                                       description: 승차 정류장/역 X좌표 (경도)
 *                                     startY:
 *                                       type: number
 *                                       format: double
 *                                       description: 승차 정류장/역 Y좌표 (위도)
 *                                     endNameKor:
 *                                       type: string
 *                                       description: 하차 정류장/역명 국문
 *                                     endX:
 *                                       type: number
 *                                       format: double
 *                                       description: 하차 정류장/역 X좌표
 *                                     endY:
 *                                       type: number
 *                                       format: double
 *                                       description: 하차 정류장/역 Y좌표
 *                                     subwayNameKor:
 *                                       type: string
 *                                       description: 지하철 노선명 (지하철인 경우)
 *                                     subwayCode:
 *                                       type: integer
 *                                       description: 지하철 노선 번호 (지하철인 경우 필수)
 *                                     way:
 *                                       type: string
 *                                       description: 방면 정보 (지하철인 경우 필수)
 *                                     wayCode:
 *                                       type: integer
 *                                       description: 방면 정보 코드 (1-상행, 2-하행)
 *                                     door:
 *                                       type: string
 *                                       description: 지하철 빠른 환승 위치 (지하철인 경우 필수)
 *                                     startExitNo:
 *                                       type: string
 *                                       description: 지하철 들어가는 출구 번호 (필수 아님)
 *                                     startExitX:
 *                                       type: number
 *                                       format: double
 *                                       description: 지하철 들어가는 출구 X좌표 (필수 아님)
 *                                     startExitY:
 *                                       type: number
 *                                       format: double
 *                                       description: 지하철 들어가는 출구 Y좌표 (필수 아님)
 *                                     endExitNo:
 *                                       type: string
 *                                       description: 지하철 나가는 출구 번호 (필수 아님)
 *                                     endExitX:
 *                                       type: number
 *                                       format: double
 *                                       description: 지하철 나가는 출구 X좌표 (필수 아님)
 *                                     endExitY:
 *                                       type: number
 *                                       format: double
 *                                       description: 지하철 나가는 출구 Y좌표 (필수 아님)
 *                                     busNoKor:
 *                                       type: string
 *                                       description: 버스 번호 (버스인 경우 필수)
 *                                     type:
 *                                       type: integer
 *                                       description: 버스 타입 (버스인 경우 필수)
 *                                     passStopList:
 *                                       type: array
 *                                       items:
 *                                         type: object
 *                                         properties:
 *                                           stationIndex:
 *                                             type: integer
 *                                             description: 정류장 순번
 *                                           stationNameKor:
 *                                             type: string
 *                                             description: 정류장 명칭
 *                                           stationX:
 *                                             type: number
 *                                             format: double
 *                                             description: 정류장 X좌표 (경도)
 *                                           stationY:
 *                                             type: number
 *                                             format: double
 *                                             description: 정류장 Y좌표 (위도)
 *                                           isNonStop:
 *                                             type: boolean
 *                                             description: 미정차 정류장 여부 (버스인 경우 필수)
 */

app.get('/api/public/:startLongitude,:startLatitude/:endLongitude,:endLatitude', (req: Request, res: Response) => {
  res.json({  });
});

/**
 * @swagger
 * /car/{startLongitude},{startLatitude}/{endLongitude},{endLatitude}:
 *   get:
 *     summary: 자동차 경로 조회
 *     description: 출발지와 도착지의 경도, 위도를 기반으로 자동차 경로 정보를 조회,option 파라미터가 없으면 기본값으로 traoptimal을 사용
 *     parameters:
 *       - in: path
 *         name: startLongitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 출발지 경도
 *       - in: path
 *         name: startLatitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 출발지 위도
 *       - in: path
 *         name: endLongitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 도착지 경도
 *       - in: path
 *         name: endLatitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 도착지 위도
 *       - in: query
 *         name: option
 *         required: false
 *         schema:
 *           type: string
 *           default: traoptimal
 *         description: 경로 옵션 (기본값- traoptimal)
 *     responses:
 *       200:
 *         description: 자동차 경로 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     route:
 *                       type: object
 *                       properties:
 *                         "{optionValue}":
 *                           type: object
 *                           properties:
 *                             startLocation:
 *                               type: array
 *                               items:
 *                                 type: number
 *                               description: 출발지 좌표(경도, 위도)
 *                             goalLocation:
 *                               type: array
 *                               items:
 *                                 type: number
 *                               description: 목적지 좌표(경도, 위도)
 *                             duration:
 *                               type: integer
 *                               description: 전체 경로 소요 시간 (밀리초)
 *                             distance:
 *                               type: integer
 *                               description: 전체 경로 거리 (m)
 *                             departureTime:
 *                               type: string
 *                               format: date-time
 *                               description: 예상 도착 일시
 *                             taxiFare:
 *                               type: integer
 *                               description: 택시 요금
 *                             path:
 *                               type: array
 *                               items:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                                   format: double
 *                                 description: 경로를 구성하는 좌표, [0]=X좌표 [1]=Y좌표 
 *                             section:
 *                               description: 전체 경로 중 주행 길이가 긴 일부 경로의 정보를 도로 이름을 기준으로 표시
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   pointIndex:
 *                                     type: integer
 *                                     description: path 에서의 인덱스 번호
 *                                   pointCount:
 *                                     type: integer
 *                                     description: 형상점 수
 *                                   name:
 *                                     type: string
 *                                     description: 도로 이름
 */

app.get('/api/car/:startLongitude,:startLatitude/:endLongitude,:endLatitude', (req: Request, res: Response) => {
  res.json({ });
});

/**
 * @swagger
 * /taxi/{startLongitude},{startLatitude}/{endLongitude},{endLatitude}/{maxFare}/{appointmentTime}:
 *   get:
 *     summary: 택시 경로 조회
 *     description: 출발지와 도착지의 경도, 위도, 상한비용과 약속 시간을 기반으로 택시 경로 및 대중교통 경로 조회.
 *     parameters:
 *       - in: path
 *         name: startLongitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 출발지 경도
 *       - in: path
 *         name: startLatitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 출발지 위도
 *       - in: path
 *         name: endLongitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 도착지 경도
 *       - in: path
 *         name: endLatitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 도착지 위도
 *       - in: path
 *         name: maxFare
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상한 비용
 *       - in: path
 *         name: appointmentTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 약속 시간
 *     responses:
 *       200:
 *         description: 택시 경로 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           pathAttribute:
 *                             type: integer
 *                             description: 경로 속성 (1-최소시간, 2-최소비용(시간설정시))
 *                           isOptimal:
 *                             type: boolean
 *                             description: 최적인지 여부
 *                           taxiInfo:
 *                             type: object
 *                             properties:
 *                               startLocation:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                                 description: 출발지 좌표(경도, 위도)
 *                               goalLocation:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                                 description: 목적지 좌표(경도, 위도)
 *                               duration:
 *                                 type: integer
 *                                 description: 전체 경로 소요 시간 (밀리초)
 *                               distance:
 *                                 type: integer
 *                                 description: 전체 경로 거리 (m)
 *                               departureTime:
 *                                 type: string
 *                                 format: date-time
 *                                 description: 예상 도착 일시
 *                               taxiFare:
 *                                 type: integer
 *                                 description: 택시 요금
 *                               path:
 *                                 type: array
 *                                 items:
 *                                   type: array
 *                                   items:
 *                                     type: number
 *                                     format: double
 *                                   description: 경로를 구성하는 좌표, [0]=X좌표 [1]=Y좌표 
 *                               section:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     pointIndex:
 *                                       type: integer
 *                                       description: path 에서의 인덱스 번호
 *                                     pointCount:
 *                                       type: integer
 *                                       description: 형상점 수
 *                                     name:
 *                                       type: string
 *                                       description: 도로 이름
 *                     publicInfo:
 *                       type: object
 *                       properties:
 *                         totalWalk:
 *                           type: integer
 *                           description: 총 도보 이동거리
 *                         totalTime:
 *                           type: integer
 *                           description: 총 소요시간
 *                         payment:
 *                           type: integer
 *                           description: 총 요금
 *                         firstStartStationKor:
 *                           type: string
 *                           description: 최초 출발역/정류장 국문
 *                         lastEndStationKor:
 *                           type: string
 *                           description: 최종 도착역/정류장 국문
 *                         subPath:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               trafficType:
 *                                 type: integer
 *                                 description: 이동 수단 종류 (1-지하철, 2-버스, 3-도보)
 *                               sectionTime:
 *                                 type: integer
 *                                 description: 이동 소요 시간
 *                               intervalTime:
 *                                 type: integer
 *                                 description: 평균 배차 간격 (분)
 *                               startNameKor:
 *                                 type: string
 *                                 description: 승차 정류장/역명 국문
 *                               startX:
 *                                 type: number
 *                                 format: double
 *                                 description: 승차 정류장/역 X좌표 (경도)
 *                               startY:
 *                                 type: number
 *                                 format: double
 *                                 description: 승차 정류장/역 Y좌표 (위도)
 *                               endNameKor:
 *                                 type: string
 *                                 description: 하차 정류장/역명 국문
 *                               endX:
 *                                 type: number
 *                                 format: double
 *                                 description: 하차 정류장/역 X좌표
 *                               endY:
 *                                 type: number
 *                                 format: double
 *                                 description: 하차 정류장/역 Y좌표
 *                               subwayNameKor:
 *                                 type: string
 *                                 description: 지하철 노선명 (지하철인 경우)
 *                               subwayCode:
 *                                 type: integer
 *                                 description: 지하철 노선 번호 (지하철인 경우 필수)
 *                               way:
 *                                 type: string
 *                                 description: 방면 정보 (지하철인 경우 필수)
 *                               wayCode:
 *                                 type: integer
 *                                 description: 방면 정보 코드 (1-상행, 2-하행)
 *                               door:
 *                                 type: string
 *                                 description: 지하철 빠른 환승 위치 (지하철인 경우 필수)
 *                               startExitNo:
 *                                 type: string
 *                                 description: 지하철 들어가는 출구 번호 (필수 아님)
 *                               startExitX:
 *                                 type: number
 *                                 format: double
 *                                 description: 지하철 들어가는 출구 X좌표 (필수 아님)
 *                               startExitY:
 *                                 type: number
 *                                 format: double
 *                                 description: 지하철 들어가는 출구 Y좌표 (필수 아님)
 *                               endExitNo:
 *                                 type: string
 *                                 description: 지하철 나가는 출구 번호 (필수 아님)
 *                               endExitX:
 *                                 type: number
 *                                 format: double
 *                                 description: 지하철 나가는 출구 X좌표 (필수 아님)
 *                               endExitY:
 *                                 type: number
 *                                 format: double
 *                                 description: 지하철 나가는 출구 Y좌표 (필수 아님)
 *                               busNoKor:
 *                                 type: string
 *                                 description: 버스 번호 (버스인 경우 필수)
 *                               type:
 *                                 type: integer
 *                                 description: 버스 타입 (버스인 경우 필수)
 *                               passStopList:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     stationIndex:
 *                                       type: integer
 *                                       description: 정류장 순번
 *                                     stationNameKor:
 *                                       type: string
 *                                       description: 정류장 명칭
 *                                     stationX:
 *                                       type: number
 *                                       format: double
 *                                       description: 정류장 X좌표 (경도)
 *                                     stationY:
 *                                       type: number
 *                                       format: double
 *                                       description: 정류장 Y좌표 (위도)
 *                                     isNonStop:
 *                                       type: boolean
 *                                       description: 미정차 정류장 여부 (버스인 경우 필수)
 */



app.get('/api/taxi/:startLongitude,:startLatitude/:endLongitude,:endLatitude/:maxFare/:appointmentTime', (req: Request, res: Response) => {
  res.json({  });
});

/**
 * @swagger
 * /api/search/{query}:
 *   get:
 *     summary: 검색 결과 조회
 *     description: 주어진 검색어(query)를 바탕으로 업체 또는 기관의 정보를 검색하고, 그 결과를 반환합니다.
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색어
 *     responses:
 *       200:
 *         description: 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 총 검색 결과 개수
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             description: 업체, 기관의 이름
 *                           link:
 *                             type: string
 *                             description: 업체, 기관의 상세 정보 URL
 *                           category:
 *                             type: string
 *                             description: 업체, 기관의 분류 정보 (없으면 ""로 나옴)
 *                           description:
 *                             type: string
 *                             description: 업체, 기관에 대한 설명 (없으면 ""로 나옴)
 *                           address:
 *                             type: string
 *                             description: 업체, 기관명의 지번 주소
 *                           roadAddress:
 *                             type: string
 *                             description: 업체, 기관명의 도로명 주소
 *                           mapx:
 *                             type: integer
 *                             description: 업체, 기관이 위치한 장소의 x좌표(경도좌표)
 *                           mapy:
 *                             type: integer
 *                             description: 업체, 기관이 위치한 장소의 y좌표(위도좌표)
 */
app.get('/api/search/:query', (req: Request, res: Response) => {
  res.json({  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
